class GripSize < ActiveRecord::Base

  def to_s
    case self.size
    when 0 then "4 0/8 (L0)"
    when 1 then "4 1/8 (L1)"
    when 2 then "4 1/4 (L2)"
    when 3 then "4 3/8 (L3)"
    when 4 then "4 1/2 (L4)"
    when 5 then "4 5/8 (L5)"
    when 6 then "4 6/8 (L6)"
    end
  end

  def name
    return self.to_s
  end

  def as_json options = {}
    super(:methods => [:name])
  end
end
