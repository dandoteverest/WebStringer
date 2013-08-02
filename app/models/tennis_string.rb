class TennisString < ActiveRecord::Base
  belongs_to :string_manufacturer
  belongs_to :string_construction
  has_attached_file :image,
                    :styles => { :medium => "300x300>", :small => "200x200>", :thumb => "100x100>" }#,
                    #:storage => :s3,
                    #:s3_credentials => {
                        #:bucket            => ENV['S3_BUCKET_NAME'],
                        #:access_key_id     => ENV['AWS_ACCESS_KEY_ID'],
                        #:secret_access_key => ENV['AWS_SECRET_ACCESS_KEY']
                    #}
  def name_with_construction_and_gauge
    "#{self.name} #{self.string_construction.construction} (#{self.gauge})" rescue "#{self.name}"
  end

  def full_name
    "#{self.string_manufacturer.name} #{self.name}" rescue "#{self.name}"
  end

  def name_with_gauge
    "#{self.name} (#{"%.2f" % self.gauge})" rescue "#{self.name}"
  end

  def full_name_with_gauge
    "#{self.string_manufacturer.name} #{self.name} (#{self.gauge})" rescue "#{self.name}"
  end

  def manufacturer
    self.string_manufacturer.name
  end

  def construction
    self.string_construction.construction
  end

  def leaf
    true
  end

  def string_image_url_small
    self.image.url(:small)
  end

  def string_image_url_medium
    self.image.url(:medium)
  end

  def string_image_url
    self.image.url
  end

  def as_json options = {}
    super(:methods => [:construction, :full_name, :manufacturer, :name_with_gauge, :full_name_with_gauge, :leaf, :string_image_url, :string_image_url_medium, :string_image_url_small])
  end
end
