class UsersController < ApplicationController
  skip_before_filter :authorize, :only => :create

  def new
    @user = User.new
  end

  def create
    
    if params[:user][:password] != params[:user][:password_verify]
        resp = "{success: false, errorMsg: 'Passwords do not match'}"
    else
        params[:user].delete(:password_verify)
        pass = params[:user][:password]
        params[:user].delete(:password)
        if params[:user][:company].empty?
            params[:user].delete(:company)
        end
        @user = User.create(params[:user])
        @user.password = pass
        @user.save
        #redirect_to :controller=> :admin, :action => :login
        resp = "{success: true}"
    end
    render :json => resp
  end

  def login
    @user = User.authenticate(params[:login], params[:password])
    if @user
      session[:user_id] = @user.id
      respond_to do |format|
        format.html { redirect_to '/web_stringer' }
        format.json { render :json => "{ success: true }" }
      end
    else
      flash[:error] = "Invalid login or password"
      redirect_to '/admin/login', :userName => params[:login]
    end
  end

  def index
    users = User.where("company_id = ?", User.current.company)
    respond_to do |format|
        format.json { render :json =>  users }
    end
  end

  def tree_view
    json_val = ""
    if (User.current.is_site_admin?)
        if params[:node].to_i > 0
            json_val = "{\nsuccess: true,\nnodes:"
            values = User.where("company_id = ?", params[:node]).order("last_name, first_name")
            json_val += values.to_json
            json_val += "\n}"
        else
            values = Company.order(:name)
            json_val = "{\n\"root\": \"Users\",\n\"children\":"
            json_val += values.to_json
            json_val += "\n}"
        end
    else
        users = User.where("company_id = ?", User.current.company).order("last_name, first_name")
        json_val = "{\n\"root\": \"Users\",\n\"children\":"
        json_val += users.to_json
        json_val += "\n}"
    end
    render :json => json_val
  end

protected

  #def authorize
  #end
end
