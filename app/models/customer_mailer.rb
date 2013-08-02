class CustomerMailer < ActionMailer::Base
  
    def racket_completed(racket_stringing)
      recipients(racket_stringing.customer_racket.customer.email)
      from((User.current.email rescue "nobody@do-not-reply.com"))
      subject("Your #{racket_stringing.customer_racket.racket.full_name}")
      content_type("text/html")
      body(:racket_stringing => racket_stringing)
    end

end
