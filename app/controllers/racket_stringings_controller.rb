class RacketStringingsController < ApplicationController
  def new
    @racket_stringing = RacketStringing.new
  end

  def index
    if (params[:customer_racket_id])
        @customer_racket = CustomerRacket.find(params[:customer_racket_id]);
        ActiveRecord::Base.include_root_in_json = false
        render :json => @customer_racket.racket_stringings.authorized.to_json(:methods => [ :tension, :string_name, :strung_by ])
    else
        render :json => RacketStringing.authorized.to_json(:methods => [ :tension, :string_name, :strung_by ])
    end

  end

  def create
    @customer_racket = CustomerRacket.find(params[:customer_racket_id])
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
    params[:racket_stringing][:cost] = (Regexp.new(/[0-9]+(\.[0-9][0-9])?/).match(params[:cost])[0] rescue 0);
    params[:racket_stringing][:requested_by] = params[:requested_by] unless params[:requested_by].nil? or params[:requested_by].empty?
    params[:racket_stringing][:strung_on] = params[:strung_on] unless params[:strung_on].nil? or params[:strung_on].empty?
    params[:racket_stringing][:user_id] = User.find(params[:user_id]).id rescue User.current.id
    params[:racket_stringing][:notes] = params[:notes]
    racket_stringing = RacketStringing.create(params[:racket_stringing])
    @customer_racket.racket_stringings << racket_stringing if racket_stringing.errors.empty?
    @customer_racket.save
    racket_stringing[:success] = true
    #debugger
    #val = racket_stringing.as_json(:methods => [:tension, :string_name])
    render :json => racket_stringing
    #render :json => "{status: 200, success: true}"
  end

  def show
    render :json => RacketStringing.authorized.find(params[:id]).to_json(:methods => [ :tension, :string_name, :strung_by ]) rescue "{ success: false }"
  end

  def update
    racket_stringing = (RacketStringing.authorized.find(params[:id]) rescue nil)
    if racket_stringing
      begin
        racket_stringing.update_attributes!(params[:racket_stringing])
        render :json => "{success: true}"
      rescue => e
        render :json => "{success: false, reason: \"#{e.message}\"}"
      end
    else
      render :json => "{success: false}"
    end
  end

  def queue
    totalCount = RacketStringing.authorized.where('strung_on is NULL').order('requested_by ASC').count
    racket_stringings =
      RacketStringing.authorized.where('strung_on is NULL').order('requested_by ASC').paginate(:page => params[:page], :per_page => params[:limit])

    jsonString = "{\n\"totalCount\": #{totalCount},\n\"racket_stringings\":[\n"
    if racket_stringings
      racket_stringings.each do |rs|
        jsonString += rs.to_json
        jsonString += "," unless rs == racket_stringings.last
      end
    end
    jsonString += "]}"
    render :json => jsonString
  end

  def destroy
    racket_stringing = RacketStringing.find(params[:id])
    begin
      racket_stringing.destroy
      render :json => "{ success: true }"
    rescue => e
      render :json => "{ success: false, reason: #{e.message} }"
    end
  end
end
