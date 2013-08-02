class RacketStringing < ActiveRecord::Base
  belongs_to :racket_manufacturer
  belongs_to :customer_racket
  belongs_to :user
  has_one :customer, :through => :customer_racket
  belongs_to :main_string, :class_name => "TennisString"
  belongs_to :cross_string, :class_name => "TennisString"

  default_scope order('strung_on DESC')

  scope :authorized, lambda {
    where("user_id = ?", (User.current.id rescue -1))
  }

  class << self
    alias_method :old_find, :find
    def find(*args)
      racket_stringing = old_find(*args)
      unless racket_stringing.nil?
        if racket_stringing.class == Array
          racket_stringing = racket_stringing.collect{|rs| rs unless rs.customer.nil?}.compact
        elsif racket_stringing.customer.nil?
          return nil;
        end
      end
      return racket_stringing
    end
  end

  def string_name
    if self.is_two_piece
      "#{self.main_string.full_name_with_gauge} / #{self.cross_string.full_name_with_gauge}"
    else
      self.main_string.full_name_with_gauge
    end
  end

  def strung_by
    "#{self.user.full_name}"
  end

  def tension
    if self.is_two_piece
      "#{self.main_tension.to_i} / #{self.cross_tension.to_i}"
    else
      "#{self.main_tension.to_i}"
    end
  end

  def customers
    return [ self.customer ] unless self.customer.nil?
  end

  def is_late
    return self.strung_on.nil? && (self.requested_by < Date.today)
  end

  def full_name
    return "#{self.customer.last_name}, #{self.customer.first_name}" unless self.customer.nil?
  end

  def racquet_name
    return self.customer_racket.racket.full_name unless self.customer_racket.nil?
  end

  def as_json (options)
    options = {} if options.nil?
    options.merge!(:methods => [:is_late, :full_name, :racquet_name, :customers]){|key, newval, oldval| [oldval, newval].flatten}
    #options.merge!(:methods => [:is_late]){|key, newval, oldval| [oldval, newval].flatten}
    super(options)
  end
end
