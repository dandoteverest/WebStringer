class CustomerRacketsController < ApplicationController

  def new
    @customer_racket = CustomerRacket.new(:customer => Customer.find(params[:customer_id]))
  end

  def show
    @customer_racket = CustomerRacket.find(params[:id]);
    respond_to do |format|
      format.json { render :json => @customer_racket.get_json }
    end
  end

  def destroy
    begin
        CustomerRacket.find(params[:id]).delete;
        render :json => "{ success: true }"
    rescue => e
      render :json => "{ success: false }"
    end
  end

  def create
    @customer_racket = CustomerRacket.create(params[:customer_racket])
    if @customer_racket.save
      render :json => "{ success: true, url: '#{customer_racket_path(@customer_racket)}.json', customer_racquet: #{@customer_racket.as_tree_node} }"
    else
      render :json => "{ success: false }"
    end
  end

  def update_racket_models
    racket_manufacturer = RacketManufacturer.find(params[:racket_manufacturer_id])
    @racket_models = Racket.find_all_by_racket_manufacturer_id(racket_manufacturer)
  end

  def update_racket_model_details
    @racket = Racket.find(params[:racket_id])
  end

  def edit
    params[:page] ||= 1
    params[:per_page] ||= 10
    @customer_racket = CustomerRacket.find(params[:id])
    @racket_stringings = @customer_racket.racket_stringings.paginate(:page => params[:page], :per_page => params[:per_page])
  end

  def update_strung_on
    racket_stringing = RacketStringing.find(params[:id])
    if params[:strung_on] == "true"
      racket_stringing.strung_on = Time.now
    else
      racket_stringing.strung_on = nil
    end
    racket_stringing.save
    
    if params[:notify] == "true"
      CustomerMailer.deliver(CustomerMailer.create_racket_completed(racket_stringing))
    end
  end

  def update_payment_received
    racket_stringing = RacketStringing.find(params[:id])
    racket_stringing.payment_received = params[:payment_received]
    racket_stringing.save
  end

  def update_customer_racket_notes
    @customer_racket = CustomerRacket.find(params[:id])
    @customer_racket.notes = params[:customer_racket_notes]
    @customer_racket.save
    respond_to do |format|
      format.json { render :json => @customer_racket.get_json }
    end
  end

  def get_rackets_by_manufacturer
    @racket_manufacturer = RacketManufacturer.find(params[:racket_manufacturer_id])
    @racket = Racket.all_for_manufacturer(@racket_manufacturer).first
  end

  def get_racket_image
    @racket = Racket.find(params[:racket_id])
  end

  def new_stringing
    @customer_racket = CustomerRacket.find(params[:id])
    params[:racket_stringing] = {:dropped_off => params[:dropped_off]}
    if params[:is_two_piece]
      params[:racket_stringing][:is_two_piece] = true
      params[:racket_stringing][:main_string] = TennisString.find(params[:main_string])
      params[:racket_stringing][:main_tension] = params[:main_tension]
      params[:racket_stringing][:cross_string] = TennisString.find(params[:cross_string])
      params[:racket_stringing][:cross_tension] = params[:cross_tension]
    else
      params[:racket_stringing][:is_two_piece] = false
      params[:racket_stringing][:main_string] = TennisString.find(params[:main_string])
      params[:racket_stringing][:main_tension] = params[:main_tension]
    end
    params[:racket_stringing][:cost] = params[:cost]
    params[:racket_stringing][:requested_by] = params[:requested_by] unless params[:requested_by].empty?
    params[:racket_stringing][:strung_on] = params[:strung_on] unless params[:strung_on].empty?
    racket_stringing = RacketStringing.create(params[:racket_stringing])
    @customer_racket.racket_stringings << racket_stringing if racket_stringing.errors.empty?
    @customer_racket.save

    params[:page] ||= 1
    params[:per_page] ||= 10
    @racket_stringings = @customer_racket.racket_stringings.paginate(:page => params[:page], :per_page => params[:per_page])
  end
end
