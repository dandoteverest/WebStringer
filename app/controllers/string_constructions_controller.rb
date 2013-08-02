
class StringConstructionsController < ApplicationController

  def new
    @string = StringConstruction.create(params[:string_construction])
    if @string.id
      render :json => "{success: true}"
    else
      render :json => "{success: false}"
    end
  end

  def index
    render :json => StringConstruction.all(:order => :construction)
  end
end
