# Filters added to this controller apply to all controllers in the application.
# Likewise, all the methods added will be available for all controllers.

class ApplicationController < ActionController::Base
  helper :all # include all helpers, all the time
  protect_from_forgery # See ActionController::RequestForgeryProtection for details

  #session :on

  # Scrub sensitive parameters from your log
  # filter_parameter_logging :password

  before_filter :authorize, :except => :login

  before_filter :set_no_root

  def set_no_root
    ActiveRecord::Base.include_root_in_json = false
  end

  def authorize
    User.current =  User.find_by_id(session[:user_id])
    unless User.current and User.current.active?
      redirect_to :controller => :admin, :action => :login
    #else 
      #CustomerRacket.first.racket_stringings[0].customer
    end
    
  end
end
