class TennisStringsController < ApplicationController
  def new
    @tennis_string = TennisString.new()
    @tennis_string.racket_manufacturer_id = params[:racket_manufacturer_id] if params[:racket_manufacturer_id]
  end

  def index
    render :json => TennisString.all(:order => "string_manufacturers.name, tennis_strings.name", :include => :string_manufacturer)
  end

  def all_for_manufacturer
    if (params[:manufacturer_id])
      @strings = TennisString.where("string_manufacturer_id = ?", params[:manufacturer_id]).order("string_manufacturers.name, tennis_strings.name").joins(:string_manufacturer)
    else
      @strings = TennisString.order("string_manufacturers.name, tennis_strings.name").joins(:string_manufacturer)
    end

    total = 0;
    if (params[:page]) 
        total = @strings.count
        @strings = @strings.paginate(:page => params[:page], :per_page => params[:limit])
    end

    resp = {
        :totalCount => total,
        :strings => @strings
    }
    
    render :json => resp
  end

  def tree_view
    # Get them this way so we only get manufacturers for whom we have strings
    #tennis_strings = TennisString.all(:group => :string_manufacturer_id, :order => "string_manufacturers.name", :include => :string_manufacturer)
    tennis_strings = TennisString.group(:string_manufacturer_id).includes(:string_manufacturer).order("string_manufacturers.name, tennis_strings.name")
    tennis_strings_json = "{\"root\": \"Strings\",\"children\":["
    tennis_strings.each do |tennis_string|
      tennis_strings_json += "\n{\n\"name\": \"#{tennis_string.string_manufacturer.name}\",\n\"children\":"
      tennis_strings_json += TennisString.find_all_by_string_manufacturer_id(tennis_string.string_manufacturer, :order => 'name, gauge').to_json
      tennis_strings_json += "\n}"
      tennis_strings_json += "," unless tennis_string == tennis_strings.last
    end
    tennis_strings_json += "\n]}"
    render :json => tennis_strings_json
  end

  def load_manufacturers
    render :json => TennisString.all(:order => "string_manufacturers.name, tennis_strings.name", :include => :string_manufacturer)
  end

  def show
    @tennis_string = TennisString.find(params[:id])
    render :json => @tennis_string
  end

  def users_of
    if ActiveRecord::Base.connection.adapter_name =~ /mysql/i
        stringings = RacketStringing.authorized.all(:conditions => ["main_string_id = ? OR cross_string_id = ?", params[:id], params[:id]], :group => :customer_racket_id) 
    else
        stringings = RacketStringing.authorized.all(:conditions => ["main_string_id = ? OR cross_string_id = ?", params[:id], params[:id]], :select => :customer_racket_id) 
    end
    customers = stringings.collect do |stringing|
        r = stringing.customer_racket
        if !r
          nil
        else
          {
            :id => r.customer.id,
            :first_name => r.customer.first_name,
            :last_name => r.customer.last_name,
            :racket_id => r.id
          }
        end
    end
    render :json => customers.compact.uniq{|c| c[:id]}.sort{|c1, c2| c1[:last_name] <=> c2[:last_name]}
  end

  def update
    @racket = Racket.find(params[:id])
    @racket.update_attributes(params[:racket])
    render :json => "{success: true}"
  end

  def update_data
    @tennis_string = TennisString.find(params[:id])
    if @tennis_string.update_attributes(params[:tennis_string])
      @value = true
    else
      @value = false
    end
    render :layout => false
  end

  def create
    @tennis_string = TennisString.create(params[:tennis_string])
    if @tennis_string.id.nil?
      #@value = "{success: false}"
      @tennis_string[:success] = false
    else
      #@value = "{success: true}"
      @tennis_string[:success] = true
    end
    render :layout => false
  end

  def tennis_strings_for_combo
    @tennis_strings = TennisString.all(:include => :string_manufacturer, :order => "string_manufacturers.name, tennis_strings.name, tennis_strings.gauge")
    ActiveRecord::Base.include_root_in_json = false
    render :json => @tennis_strings
  end
  
end
