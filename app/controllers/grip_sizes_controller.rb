class GripSizesController < ApplicationController
  def index
    @grip_sizes = GripSize.all(:order => :size)
    respond_to do |format|
      format.html # new.html.erb
      format.json  { render :json => @grip_sizes }
    end
  end

end
