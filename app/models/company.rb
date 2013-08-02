class Company < ActiveRecord::Base
    has_many :users

    def full_name
        self.name
    end

    def as_json(options = {})
        super(:methods => [ :full_name ])
    end
end
