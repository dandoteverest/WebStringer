class CustomerFiltersController < ApplicationController
    def index
        render :json => CustomerFilter.order(:value)
    end
end
