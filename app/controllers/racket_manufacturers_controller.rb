
class RacketManufacturersController < ApplicationController

  def update
    @racquet = RacketManufacturer.find(params[:id])
    if @racquet
        @racquet.update_attributes(params[:racket_manufacturer])
        render :json => "{success: true}"
    else
        render :json => "{success: false}"
    end
  end

  def create
    @racquet = RacketManufacturer.create(params[:racket_manufacturer])
    if @racquet.id
      render :json => "{success: true}"
    else
      render :json => "{success: false}"
    end
  end

  def index
    render :json => RacketManufacturer.all(:order => 'name')
  end
end
