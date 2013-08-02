class CustomerRacket < ActiveRecord::Base
  has_many :racket_stringings, :order => 'strung_on DESC', :dependent => :destroy
  belongs_to :racket
  belongs_to :customer
  belongs_to :grip_size

  scope :authorized, lambda {
    includes(:customer).where("customers.user_id = ?", (User.current.id rescue -1))
  }

  class << self
    alias_method :old_find, :find
    def find(*args)
      options = args.extract_options!
      conditions = options[:conditions]
      if (conditions.nil?)
        options[:conditions] = ['customers.user_id = ?', (User.current.id rescue -1)]
      else
        if conditions.class == Array
          conditions[0] = "#{conditions[0]} AND customers.user_id = ?"
          conditions << (User.current.id rescue -1)
        else
          conditions = "#{conditions} AND customers.user_id = #{(User.current.id rescue -1)}"
        end
        options[:conditions] = conditions
      end

      includes = options[:include]
      if includes.nil?
        options[:include] = [:customer]
      else
        if includes.class == Array
          includes << :customer
          includes = includes.flatten.uniq
        else
          includes = [includes, :customer].flatten.uniq
        end
        options[:include] = includes
      end

      args << options
      old_find(*args)
    end
  end

  def current_bill
    total_owed = 0
    racket_stringings.each do |racket_stringing|
      total_owed += racket_stringing.cost unless racket_stringing.payment_received?
    end
    total_owed
  end

  def customers
    [ self.customer.as_json ]
  end

  def rackets
    [ self.racket ]
  end

  def tree_id
    "racket_#{self.id}"
  end

  def grip
    self.grip_size.to_s
  end

  def as_tree_node
    customerJson = "{\n\t\"name\": \"#{racket.racket_manufacturer.name} #{racket.model}\""
    customerJson += ",\n\t\"id\": #{id}"
    customerJson += ",\n\t\"tree_id\": \"racket_#{id}\""
    customerJson += ",\n\t\"leaf\": true"
    customerJson += ",\n\t\"iconCls\": \"racquet-icon\""
    customerJson += ",\n\t\"customer_id\": #{customer.id}"
    customerJson += ",\n\t\"lastStrungOn\": \"#{racket_stringings.first.strung_on}\"" if racket_stringings.first
    customerJson += ",\n\t\"current_bill\": #{current_bill}"
    customerJson += "\n\t}"
  end

  def get_json
    ActiveRecord::Base.include_root_in_json = false
    self.to_json(:methods => [:rackets, :grip], :include => { :racket_stringings => { :methods => [:string_name, :tension] } } )
  end

  def as_json(options = {})
    super(:include => {:racket_stringings => {:methods => [:string_name, :tension, :strung_by] }}, :methods => [:customers, :rackets, :grip] )
  end
end
