WebStringer::Application.routes.draw do
  resources :tennis_strings do
    member do
      get 'users_of'
      post 'update_data'
    end

    collection do
      get 'tree_view'
      get 'tennis_strings_for_combo'
      get 'load_manufacturers'
      get 'all_for_manufacturer'
    end
  end

  resources :racket_stringings do
    collection do
      get 'queue'
      get 'accounts_receivable'
    end
  end

  resources :customers do
    collection do
      get 'load_customer_rackets'
    end
  end

  resources :accounts_receivable

  resources :web_stringer

  resources :metrics

  resources :customer_filters

  resources :companies

  resources :grip_sizes

  resources :customer_rackets do
    member do
      post 'update_customer_racket_notes'
    end
    collection do
      get 'queue'
    end
  end

  resources :string_constructions

  resources :string_manufacturers

  resources :racket_manufacturers

  resources :admin do
    collection do
      get 'login'
    end
  end

  resources :users do
    collection do
      get 'tree_view'
      post 'login'
    end
  end

  resources :string_patterns

  resources :rackets do
    member do
      get 'users_of'
      post 'update_data'
    end

    collection do
      get 'tree_view'
      get 'load_racket_details'
      get 'load_manufacturers'
      get 'all_for_manufacturer'
    end
  end

  root :to => "customers#index"

  # The priority is based upon order of creation:
  # first created -> highest priority.

  # Sample of regular route:
  #   match 'products/:id' => 'catalog#view'
  # Keep in mind you can assign values other than :controller and :action

  # Sample of named route:
  #   match 'products/:id/purchase' => 'catalog#purchase', :as => :purchase
  # This route can be invoked with purchase_url(:id => product.id)

  # Sample resource route (maps HTTP verbs to controller actions automatically):
  #   resources :products

  # Sample resource route with options:
  #   resources :products do
  #     member do
  #       get 'short'
  #       post 'toggle'
  #     end
  #
  #     collection do
  #       get 'sold'
  #     end
  #   end

  # Sample resource route with sub-resources:
  #   resources :products do
  #     resources :comments, :sales
  #     resource :seller
  #   end

  # Sample resource route with more complex sub-resources
  #   resources :products do
  #     resources :comments
  #     resources :sales do
  #       get 'recent', :on => :collection
  #     end
  #   end

  # Sample resource route within a namespace:
  #   namespace :admin do
  #     # Directs /admin/products/* to Admin::ProductsController
  #     # (app/controllers/admin/products_controller.rb)
  #     resources :products
  #   end

  # You can have the root of your site routed with "root"
  # just remember to delete public/index.html.
  # root :to => 'welcome#index'

  # See how all your routes lay out with "rake routes"

  # This is a legacy wild controller route that's not recommended for RESTful applications.
  # Note: This route will make all actions in every controller accessible via GET requests.
  # match ':controller(/:action(/:id(.:format)))'
end
