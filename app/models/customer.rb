class Customer < ActiveRecord::Base
  has_many :customer_rackets, :dependent => :destroy
  has_many :racket_stringings, :through => :customer_rackets
  belongs_to :user

  scope :authorized, lambda {
    where("user_id = ?", (User.current.id rescue -1))
  }

  class << self
    alias_method :old_find, :find

    def find(*args)
      options = args.extract_options!
      conditions = options[:conditions]
      if (conditions.nil?)
        options[:conditions] = ['customers.user_id = ?', (User.current.id rescue -1)]
      else
        if conditions.class == String
          conditions = "#{conditions} AND customers.user_id = #{(User.current.id rescue -1)}"
        else
          conditions[0] = "#{conditions[0]} AND customers.user_id = ?"
          conditions << (User.current.id rescue -1)
        end
        options[:conditions] = conditions
      end
      args << options
      puts args
      old_find(*args)
    end
  end

  def full_name
    "#{self.first_name} #{self.last_name}"
  end

  def tree_id
    "customer_#{self.id}"
  end

  def as_tree_node
    name = "#{last_name}, #{first_name}"
    customerJson = "\n{\n\t\"name\": \"#{name}\","
    customerJson += "\n\t\"customer_id\": #{id},"
    customerJson += "\n\t\"tree_id\": \"customer_#{id}\","
    customerJson += "\n\t\"current_bill\": #{current_bill}"
    customerJson += "\n}"
  end

  def current_bill
    total_owed = 0
    customer_rackets.each do |customer_racket|
      customer_racket.racket_stringings.each do |racket_stringing|
        total_owed += racket_stringing.cost unless racket_stringing.payment_received?
      end
    end
    total_owed
  end

  def as_json(options = {})
    super(:methods => [:current_bill])
  end
end
