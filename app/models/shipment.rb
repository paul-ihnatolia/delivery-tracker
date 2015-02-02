class Shipment < ActiveRecord::Base
  validates :po, presence: true
  enum status: { unresolved: 0, resolved: 1 }
  belongs_to :user

  def self.by_user user
    # For carrier
    where(user_id: user.id)
  end

  validates_presence_of :user_id, message: "Your are not logged in."

  def as_json(options={})
  	{
    	start_date: self.start_date.to_s,
    	end_date: self.end_date.to_s,
      po: self.po,
      company: self.company
   	}
  end
end
