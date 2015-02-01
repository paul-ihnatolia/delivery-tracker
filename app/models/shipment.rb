class Shipment < ActiveRecord::Base
  validates :po, presence: true
  enum status: { unresolved: 0, resolved: 1 }

  def as_json(options={})
  	{
  	start_date: self.start_date.to_s,
  	end_date: self.end_date.to_s
   	}
  end
end
