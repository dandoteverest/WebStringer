class User < ActiveRecord::Base
  has_many :user_roles
  has_many :customers
  before_save :unique_roles
  belongs_to :company

  validates_presence_of :login
  validates_uniqueness_of :login

  attr_accessor :password_confirmation
  validates_confirmation_of :password

  validate :password_non_blank

  @@_current_user = nil

  def self.current=(user)
    @@_current_user = user
  end

  def self.current
    @@_current_user
  end

  def full_name
    "#{self.first_name} #{self.last_name}"
  end

  def is_user?
    !self.user_roles.empty?
  end

  def is_company_admin?
    self.user_roles.any?{|user_role| (user_role.role == Role.CompanyAdmin)}
  end

  def is_site_admin?
    self.user_roles.any?{|user_role| (user_role.role Role.SiteAdmin)}
  end

  def password
    @password
  end

  def password=(pwd)
    @password = pwd
    return if pwd.blank?
    create_new_salt
    self.hashed_password = User.encrypted_password(self.password, self.salt)
  end

  def leaf
    true
  end

  def self.authenticate(name, password)
    user = self.find_by_login(name)
    return nil if user.nil?

    encrypted_password = encrypted_password(password, user.salt)
    if user.hashed_password != encrypted_password
      user = nil
    end
    user
  end

  def as_json(options = {})
    super(:methods => [ :full_name, :leaf ], :except => [ :password, :hashed_password, :salt ])
  end

private
  def unique_roles
    self.user_roles.uniq!
  end

  def password_non_blank
    errors.add(:password, "Missing password") if hashed_password.blank?
  end

  def self.encrypted_password(password, salt)
    string_to_hash = password + "foobar" + salt
    Digest::SHA1.hexdigest(string_to_hash)
  end

  def create_new_salt
    self.salt = self.object_id.to_s + rand.to_s
  end
end
