module CustomersHelper

  def calculate_customer_balance customer
    balance = 0
    customer.customer_rackets.each do |customer_racket|
      customer_racket.racket_stringings.each do |racket_stringing|
        balance += racket_stringing.cost unless racket_stringing.payment_received?
      end
    end
    balance
  end
end
