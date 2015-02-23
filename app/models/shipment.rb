class Shipment < ActiveRecord::Base
  validates :po, presence: true
  enum status: { shipping: 0, receiving: 1 }
  belongs_to :user

  def self.by_user user
    # For carrier
    where(user_id: user.id)
  end
  scope :by_email, ->(email) { joins(:user).where('users.email = ?', email) }
  scope :by_status, ->(name) { where('shipments.status = ?', Shipment::statuses[name]) }
  validates_presence_of :user_id, message: "Your are not logged in."

  def as_json(options={})
  	{
      id: self.id,
    	start_date: self.start_date.to_s,
    	end_date: self.end_date.to_s,
      po: self.po,
      company: self.company,
      status: self.status,
      user: self.user.email
   	}
  end
end
