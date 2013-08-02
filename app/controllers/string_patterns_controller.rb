
class StringPatternsController < ApplicationController
  
  def index
    @string_patterns = StringPattern.all(:order => :name)
    respond_to do |format|
      format.json { render :json => @string_patterns }
    end
  end

  def new
  end

  def show
    @string_pattern = StringPattern.find(params[:id]);
    respond_to do |format|
      format.json { render :json => @string_pattern}
    end
  end

  def create
  end

end
