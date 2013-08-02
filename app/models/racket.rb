class Racket < ActiveRecord::Base
  belongs_to :racket_manufacturer
  belongs_to :string_pattern
  has_many :customer_rackets
  has_attached_file :image,
                    :styles => {
                        :medium => "300x300>",
                        :small => "200x200>",
                        :thumb => "100x100>"
                    }#,
                    #:storage => :s3,
                    #:s3_credentials => {
                        #:bucket            => ENV['S3_BUCKET_NAME'],
                        #:access_key_id     => ENV['AWS_ACCESS_KEY_ID'],
                        #:secret_access_key => ENV['AWS_SECRET_ACCESS_KEY']
                    #}

  scope :all_for_manufacturer, lambda{ |manufacturer|
      where('racket_manufacturer_id = ?', manufacturer.id)
  }

  def full_name
    "#{self.racket_manufacturer.name} #{self.model}" rescue "#{self.model}"
  end

  def racket_image_url_small
    self.image.url(:small)
  end

  def racket_image_url_medium
    self.image.url(:medium)
  end

  def racket_image_url
    self.image.url
  end

  def tree_id
    "racket_#{self.id}"
  end

  def pattern
    self.string_pattern.name
  end

  def name
    self.model
  end

  def leaf
    true
  end

  def manufacturer
    self.racket_manufacturer.name
  end

  def to_json options = {}
    super(:methods => [:manufacturer, :pattern, :racket_image_url, :racket_image_url_medium, :racket_image_url_small])
  end

  def as_json options = {}
    super(:methods => [:full_name, :manufacturer, :pattern, :racket_image_url, :racket_image_url_medium, :racket_image_url_small, :leaf, :name])
  end

  def racket_manufacturer_name
    "#{self.racket_manufacturer.name}"
  end
end
