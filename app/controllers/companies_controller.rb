class CompaniesController < ApplicationController
    def create
        debugger
        @company = Company.create(params[:company])
        if @company.save
            render :json => "{ success: true }"
        else
            render :json => "{ success: false }"
        end
    end
end
