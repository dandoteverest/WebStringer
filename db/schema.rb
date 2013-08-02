# encoding: UTF-8
# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended to check this file into your version control system.

ActiveRecord::Schema.define(:version => 20121004220654) do

  create_table "companies", :force => true do |t|
    t.string   "name"
    t.string   "address1"
    t.string   "address2"
    t.string   "city"
    t.integer  "state_id"
    t.string   "zip"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.integer  "phone"
  end

  create_table "customer_filters", :force => true do |t|
    t.string   "name"
    t.string   "value"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "customer_rackets", :force => true do |t|
    t.integer  "customer_id"
    t.integer  "racket_id"
    t.integer  "grip_size_id"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.string   "notes"
  end

  create_table "customers", :force => true do |t|
    t.string   "first_name"
    t.string   "last_name"
    t.string   "email"
    t.string   "home_phone"
    t.string   "cell_phone"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.integer  "user_id"
  end

  create_table "grip_sizes", :force => true do |t|
    t.integer  "size"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "racket_manufacturers", :force => true do |t|
    t.string   "name"
    t.string   "url"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "racket_stringings", :force => true do |t|
    t.integer  "customer_racket_id"
    t.integer  "main_string_id"
    t.float    "main_tension"
    t.integer  "cross_string_id"
    t.float    "cross_tension"
    t.boolean  "is_two_piece"
    t.float    "cost"
    t.date     "dropped_off"
    t.date     "requested_by"
    t.date     "strung_on"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.boolean  "payment_received"
    t.string   "notes"
    t.integer  "user_id"
  end

  create_table "rackets", :force => true do |t|
    t.string   "model"
    t.integer  "head_size"
    t.integer  "racket_manufacturer_id"
    t.integer  "string_pattern_id"
    t.string   "image_file_name"
    t.string   "image_content_type"
    t.integer  "image_file_size"
    t.datetime "image_updated_at"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "roles", :force => true do |t|
    t.integer  "value"
    t.string   "name"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "sessions", :force => true do |t|
    t.string   "session_id", :null => false
    t.text     "data"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "sessions", ["session_id"], :name => "index_sessions_on_session_id"
  add_index "sessions", ["updated_at"], :name => "index_sessions_on_updated_at"

  create_table "string_constructions", :force => true do |t|
    t.string   "construction"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "string_manufacturers", :force => true do |t|
    t.string   "name"
    t.string   "url"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "string_patterns", :force => true do |t|
    t.string   "name"
    t.integer  "mains"
    t.integer  "crosses"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "tennis_strings", :force => true do |t|
    t.integer  "string_manufacturer_id"
    t.string   "name"
    t.float    "gauge"
    t.integer  "string_construction_id"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.string   "image_file_name"
    t.string   "image_content_type"
    t.integer  "image_file_size"
    t.datetime "image_updated_at"
  end

  create_table "user_roles", :force => true do |t|
    t.integer  "user_id"
    t.integer  "role_id"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "user_roles", ["user_id", "role_id"], :name => "index_user_roles_on_user_id_and_role_id", :unique => true

  create_table "users", :force => true do |t|
    t.string   "login"
    t.string   "password"
    t.string   "first_name"
    t.string   "last_name"
    t.string   "email"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.string   "salt"
    t.string   "hashed_password"
    t.integer  "company_id"
    t.boolean  "active"
  end

end
