class AccountsReceivableController < ApplicationController

    def index
        if User.current.is_site_admin?
        # do something!
        end

        if User.current.is_company_admin?
            render :json => RacketStringing.where("payment_received is null and cost > 0 and strung_on is not null").reorder("dropped_off").to_json(:methods => [ :tension, :string_name, :strung_by ])
        else
            render :json => RacketStringing.authorized.where("payment_received is null and cost > 0 and strung_on is not null").reorder("dropped_off").to_json(:methods => [ :tension, :string_name, :strung_by ])

        end
    end
end
