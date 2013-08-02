class AdminController < ApplicationController
  layout "login", :only => :login
  layout "admin", :except => :login

  def login
    session[:user_id] = nil
    @userName = params[:userName]
    @user = User.new
    render :layout => 'login'
  end


  def index
  end
end
