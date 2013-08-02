class RacketsController < ApplicationController
  def new
    @racket = Racket.new()
    @racket.racket_manufacturer_id = params[:racket_manufacturer_id] if params[:racket_manufacturer_id]
  end

  def index
    @selected_manufacturer = RacketManufacturer.find(params[:manufacturer_id]) rescue nil
    @manufacturers = RacketManufacturer.all(:order => "name")
    respond_to do |format|
      format.html # new.html.erb
      format.json  { render :json => Racket.all(:order => "racket_manufacturers.name, model", :include => :racket_manufacturer) }
    end
  end

  def all_for_manufacturer
    if (params[:manufacturer_id])
      @rackets = Racket.where("racket_manufacturer_id = ?", params[:manufacturer_id]).order("racket_manufacturers.name, model").joins(:racket_manufacturer)
    else
      @rackets = Racket.order("racket_manufacturers.name, model").joins(:racket_manufacturer)
    end

    total = 0;
    if (params[:paginate] != "false" && params[:page]) 
        total = @rackets.count
        @rackets = @rackets.paginate(:page => params[:page], :per_page => params[:limit])
    end

    resp = {
        :success => !@rackets.empty?,
        :totalCount => total,
        :racquets => @rackets
    }

    respond_to do |format|
      format.html
      #format.json { render :json => @rackets }
      format.json { render :json => resp }
    end
  end

  def tree_view
    # Get them this way so we only get manufacturers for whom we have rackets
    rackets = Racket.group(:racket_manufacturer_id).includes(:racket_manufacturer).order("racket_manufacturers.name, rackets.model")
    rackets_json = "{\"root\": \"Rackets\",\"children\":["
    rackets.each do |racket|
      rackets_json += "\n{\n\"name\": \"#{racket.racket_manufacturer.name}\",\n\"children\":"
      rackets_json += Racket.where(:racket_manufacturer_id => racket.racket_manufacturer).order('model, head_size').to_json
      rackets_json += "\n}"
      rackets_json += "," unless racket == rackets.last
    end
    rackets_json += "\n]}"
    render :json => rackets_json
  end

  def load_manufacturers
    @rackets = Racket.all(:order => 'racket_manufacturers.name, model', :include => :racket_manufacturer)
    render :json => @rackets
  end

  def show
    @racket = Racket.find(params[:id])
    render :json => @racket.to_json
  end

  def users_of
    @racket = Racket.find(params[:id])
    if ActiveRecord::Base.connection.adapter_name =~ /mysql/i
        customers = @racket.customer_rackets.authorized.all(:group => :customer_id, :order => "customers.last_name, customers.first_name", :include => :customer)
    else
        customers = @racket.customer_rackets.authorized.all(:select => :customer_id, :order => "customers.last_name, customers.first_name", :include => :customer)
    end
    customers = customers.collect do |r|
      {
        :id => r.customer.id,
        :first_name => r.customer.first_name,
        :last_name => r.customer.last_name,
        :racket_id => r.id
      }
    end
    render :json => customers
  end

  def edit
    @racket = Racket.find(params[:id])
  end

  def update
    @racket = Racket.find(params[:id])
    if @racket.update_attributes(params[:racket])
      @value = true
    else
      @value = false
    end
    render :layout => false
  end

  def update_data
    @racket = Racket.find(params[:id])
    if @racket.update_attributes(params[:racket])
      @value = true
    else
      @value = false
    end
    render :layout => false
  end

  def create
    if params[:racket][:racket_manufacturer_id].nil? or params[:racket][:racket_manufacturer_id].empty?
      params[:racket][:racket_manufacturer_id] = RacketManufacturer.create(:name => params[:racket_manufacturer]).id
    end
    @racket = Racket.create(params[:racket])
    if @racket.id.nil?
      @value = "{success: false}"
    else
      @value = "{success: true}"
    end
    render :layout => false
  end

  def load_racket_details
    @racket = (Racket.find(params[:id]) rescue Racket.first)
    render :json => @racket.to_json(:methods => [:racket_image_url, :racket_manufacturer_name])
  end
end
