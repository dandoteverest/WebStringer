class Role < ActiveRecord::Base
  @user = nil
  @company_admin = nil
  @site_admin = nil

  def self.User
    @user = Role.find_by_name('User') if @user.nil?
    @user
  end

  def self.CompanyAdmin
    @company_admin = Role.find_by_name('Company Admin') if @company_admin.nil?
    @company_admin
  end

  def self.SiteAdmin
    @site_admin = Role.find_by_name('Site Admin') if @site_admin.nil?
    @site_admin
  end

end
