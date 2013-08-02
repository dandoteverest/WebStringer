
class StringManufacturersController < ApplicationController

  def create
    @string = StringManufacturer.create(params[:string_manufacturer])
    if @string.id
      render :json => "{success: true}"
    else
      render :json => "{success: false}"
    end
  end

  def index
    render :json => StringManufacturer.all(:order => :name)
  end
end
