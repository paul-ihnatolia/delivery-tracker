class Shipment < ActiveRecord::Base
  validates :po, presence: true
  enum status: { unresolved: 0, resolved: 1 }

  def as_json(options={})
  	{
  	'start' => self.start.to_s,
  	'end' => self.end.to_s
   	}
  end
end
