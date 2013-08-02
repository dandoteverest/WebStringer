class CustomersController < ApplicationController
  # GET /customers
  # GET /customers.xml
  def index
    @selected_customer = Customer.authorized.find(params[:customer_id]) rescue nil
    @selected_racket = CustomerRacket.find(params[:racket_id]) rescue nil

    respond_to do |format|
      format.html # index.html.erb
      format.xml  { render :xml => @customers }
    end
  end

  # GET /customers/1
  # GET /customers/1.xml
  def show
    @customer = Customer.authorized.find(params[:id])

    respond_to do |format|
      format.html # show.html.erb
      format.json  {
        render :json => @customer
      }
    end
  end

  # GET /customers/new
  # GET /customers/new.xml
  def new
    @customer = Customer.new

    respond_to do |format|
      format.html # new.html.erb
      format.xml  { render :xml => @customer }
    end
  end

  # GET /customers/1/edit
  def edit
    @customer = Customer..authorized.find(params[:id])
  end

  # POST /customers
  # POST /customers.xml
  def create
    @customer = Customer.create(params[:customer])
    @customer.user = User.current

    if @customer.save
      render :json => "{ success: true, url: '#{customer_path(@customer)}.json', customer: #{@customer.as_tree_node} }"
    else
      render :json => "{ success: false }"
    end
  end

  # PUT /customers/1
  # PUT /customers/1.xml
  def update
    @customer = Customer.authorized.find(params[:id])

    if @customer.update_attributes(params[:customer])
      render :json => "{ success: true}"
    else
      render :json => "{ success: false}"
    end
  end

  # DELETE /customers/1
  # DELETE /customers/1.xml
  def destroy
    @customer = Customer.authorized.find(params[:id])
    if @customer
        @customer.destroy
        render :json => "{ success: true}"
    else
        render :json => "{ success: false}"
    end
  end

  def load_customer_rackets
    #debugger
    #if params[:node]
    begin
        cr = CustomerRacket.find(params[:node])
        customerJson = "{\n\t\"name\": \"#{cr.racket.racket_manufacturer.name} #{cr.racket.model}\""
        customerJson += ",\n\t\"node\": #{cr.id}"
        customerJson += ",\n\t\"id\": #{cr.id}"
        customerJson += ",\n\t\"tree_id\": \"racket_#{cr.id}\""
        customerJson += ",\n\t\"url\": \"#{customer_racket_path(cr)}\""
        customerJson += ",\n\t\"customer_url\": \"#{customer_path(cr.customer)}\""
        customerJson += ",\n\t\"leaf\": true"
        customerJson += ",\n\t\"iconCls\": \"racquet-icon\""
        customerJson += ",\n\t\"customer_id\": #{cr.customer.id}"
        customerJson += ",\n\t\"selected\": true"
        customerJson += ",\n\t\"lastStrungOn\": \"#{cr.racket_stringings.first.strung_on}\"" if cr.racket_stringings.first
        customerJson += ",\n\t\"current_bill\": #{cr.current_bill}"
        customerJson += "\n}"
    rescue
        selected_customer = Customer.authorized.find(params[:selected_customer_id]) rescue nil
        selected_racket = CustomerRacket.find(params[:selected_racket_id]) rescue nil
        customerJson = "{\"name\":\"root\",\"tree_id\":\"root_0\",\"children\": ["
        #if params[:filter] and !params[:filter].empty?
            #last, first = params[:filter].split(',').delete_if{|p| p.strip.empty?}
            #customers = Customer.authorized.where("last_name like :last_name", {:last_name => "%#{last.strip}%"}).order('last_name, first_name')
            #customers = customers.where("first_name like :first_name", {:first_name => "%#{first.strip}%"}) if first
        #else
            #customers = Customer.authorized.all(:order => 'last_name, first_name')
        #end
        last, first = params[:filter].split(',').delete_if{|p| p.strip.empty?} rescue nil
        customers = Customer.authorized
        customers = customers.where("last_name like :last_name", {:last_name => "%#{last.strip}%"}) if last
        customers = customers.where("first_name like :first_name", {:first_name => "%#{first.strip}%"}) if first
        customers = customers.all(:order => 'last_name, first_name')
        customers.each do |customer|
          name = "#{customer.last_name}, #{customer.first_name}"
          customer_url = "#{customer_path(customer)}.json"
          customerJson += "\n{\n\t\"name\": \"#{name}\","
          customerJson += "\n\t\"customer_id\": #{customer.id},"
          customerJson += "\n\t\"tree_id\": \"customer_#{customer.id}\","
          customerJson += "\n\t\"url\": \"#{customer_url}\","
          if customer == selected_customer
            customerJson += "\n\t\"expanded\": true,"
            if selected_racket.nil?
              customerJson += "\n\t\"selected\": true,"
            end
          end
          customerJson += "\n\t\"current_bill\": #{customer.current_bill},"
          customerJson += "\n\t\"children\": [\n"
          customer_rackets = customer.customer_rackets
          customer_rackets.each do |cr|
            customerJson += "\t{\n\t\"name\": \"#{cr.racket.racket_manufacturer.name} #{cr.racket.model}\""
            customerJson += ",\n\t\"id\": #{cr.id}"
            customerJson += ",\n\t\"tree_id\": \"racket_#{cr.id}\""
            customerJson += ",\n\t\"url\": \"#{customer_racket_path(cr)}\""
            customerJson += ",\n\t\"customer_url\": \"#{customer_url}\""
            customerJson += ",\n\t\"leaf\": true"
            customerJson += ",\n\t\"iconCls\": \"racquet-icon\""
            customerJson += ",\n\t\"customer_id\": #{cr.customer.id}"
            customerJson += ",\n\t\"selected\": true" if selected_racket == cr
            customerJson += ",\n\t\"lastStrungOn\": \"#{cr.racket_stringings.first.strung_on}\"" if cr.racket_stringings.first
            customerJson += ",\n\t\"current_bill\": #{cr.current_bill}"
            customerJson += "\n\t}"
            customerJson += "," unless customer_rackets.last == cr
            customerJson += "\n"
          end
          customerJson += "\n\t]\n"
          customerJson += "\n}"
          customerJson += "," unless customers.last == customer # IE has a problem with trailing ',' in JSON
        end
        customerJson += "\n]\n}"
    end
    render :json => customerJson
  end

  def delete_customer_racket
    customer_racket = CustomerRacket.find(params[:id])
    @customer = customer_racket.customer
    customer_racket.destroy
    @target = params[:target]
  end
end
