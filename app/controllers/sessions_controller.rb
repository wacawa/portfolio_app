class SessionsController < ApplicationController
  def new
    @email = params[:email].gsub(/%40/, "@").gsub(/%2B/, "+") unless params[:email].nil?
    @login_error = params[:error]
    @line_state = SecureRandom.urlsafe_base64
  end

  def create
    password = SecureRandom.urlsafe_base64
    user = User.from_omniauth(login_user, request.env["omniauth.auth"])
    id = User.exists? ? ([*1..User.count] - User.pluck(:id)).first : 1
    id ||= User.last.id + 1
    user.id ||= id
    user.password ||= password
    if user.save
      if login_user && login_user != user
        if login_user.tasks.exists?
          time = Time.now.beginning_of_hour
          hour = user.tasks.exists? ? user.tasks.order(:start_datetime).last.start_datetime.hour : false
          datetime = hour ? time.change(hour: hour) : login_user.tasks.order(:start_datetime).last.start_datetime
          login_user.tasks.each do |task|
            task.update(user_id: user.id, start_datetime: datetime)
          end
        end
        logout
      end
      redirect_user(user, "Googleログインに成功しました。")
    else
      # flash.now[:_] = "もう一度お願いします。"
      flash[:_] = "もう一度お願いします。"
      # render "users/show"
      # redirect_to create_user_url(user)
      redirect_to root_url(error: true)
    end
  end

  def create_email
    email = params[:session][:email]
    user = User.find_by(email: email)
    if user && user.authenticate(params[:session][:password])
      # params[:session][:remember_me] == "1" ? remember(user) : forget(user)
      redirect_user(user, "ログインに成功しました。")
    else
      flash.now[:_] = "もう一度お願いします。"
      redirect_to root_url(email: email)
    end
  end

  def line_login
    state = SecureRandom.urlsafe_base64
    # redirect_to "https://line-login-starter-20220124.herokuapp.com"
    # redirect_to "https://line-login-starter-20220124.herokuapp.com?response_type=code&client_id=1656830695
    # &redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fcallback&state=#{SecureRandom.urlsafe_base64}&scope=openid%20email"
    # redirect_to "https://access.line.me/oauth2/v2.1/authorize?response_type=code&client_id=1656830695
    # &redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fauth%2Fline%2F&state=#{state}&scope=openid%20email"
    if Rails.env.development?
      redirect_to "https://access.line.me/oauth2/v2.1/authorize?response_type=code&client_id=#{ENV["LINE_CLIENT_ID"]}&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fauth%2Fline&state=#{state}&scope=openid%20email"
    elsif Rails.env.production?
      redirect_to "https://access.line.me/oauth2/v2.1/authorize?response_type=code&client_id=#{ENV["LINE_CLIENT_ID"]}&redirect_uri=https%3A%2F%2Fsleepy-beyond-04608.herokuapp.com%2Fauth%2Fline&state=#{state}&scope=openid%20email"
    end
  end

  def create_line
    if params[:code]
      uri = URI("https://api.line.me/oauth2/v2.1/token")
      rd_uri = Rails.env.development? ? "http://localhost:3000/auth/line" : "https://sleepy-beyond-04608.herokuapp.com/auth/line"
      parameters = {grant_type: "authorization_code", code: params[:code],  redirect_uri: rd_uri,
                    client_id: ENV["LINE_CLIENT_ID"], client_secret: ENV["LINE_CLIENT_SECRET"], code_verifier: SecureRandom.alphanumeric(100)}
      res_body = get_resbody(uri, parameters)
      if id_t = res_body["id_token"].presence
        a_token = res_body["access_token"].presence
        uri = URI('https://api.line.me/oauth2/v2.1/verify')
        parameters = {id_token: id_t, client_id: ENV["LINE_CLIENT_ID"]}
        res_body = get_resbody(uri, parameters)
        res_body["a_token"] = a_token
        res_body["provider"] = "line"
        user = User.line_omniauth(login_user, res_body)
        id = User.exists? ? ([*1..User.count] - User.pluck(:id)).first : 1
        id ||= User.last.id + 1
        password = SecureRandom.urlsafe_base64
        user.id ||= id
        user.password ||= password
        if user.save
          if login_user && login_user != user
            if login_user.tasks.exists?
              time = Time.now.beginning_of_hour
              hour = user.tasks.exists? ? user.tasks.order(:start_datetime).last.start_datetime.hour : false
              datetime = hour ? time.change(hour: hour) : login_user.tasks.order(:start_datetime).last.start_datetime
              login_user.tasks.each do |task|
                task.update(user_id: user.id, start_datetime: datetime)
              end
            end
            logout
          end
          redirect_user(user, "lineログインに成功しました。")
        else
          # flash.now[:_] = "もう一度お願いします。"
          flash[:_] = "もう一度お願いします。"
          # render "users/show"
          # redirect_to create_user_url(user)
          redirect_to root_url(error: true)
        end
      end
    elsif params[:error]
      # flash.now[:_] = "LINEログインに失敗しました。"
      flash[:_] = "LINEログインに失敗しました。"
      # render "users/show"
      # redirect_to create_user_url(user)
      redirect_to root_url(error: true)
    end
  end

  def destroy
    logout if logged_in?
    flash[:_] = "ログアウトしました。"
    redirect_to root_url
  end

end
