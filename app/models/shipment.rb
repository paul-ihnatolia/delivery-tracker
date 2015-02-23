class Shipment < ActiveRecord::Base
  validates :po, presence: true
  enum status: { shipping: 0, receiving: 1 }
  belongs_to :user

  def self.by_user user
    # For carrier
    where(user_id: user.id)
  end

  def self.not_by_user user
    where.not(user_id: user.id)
  end

  scope :by_email, ->(email) { joins(:user).where('users.email = ?', email) }
  scope :not_by_email, ->(email) { joins(:user).where('users.email != ?', email) }
  scope :by_status, ->(name) { where('shipments.status = ?', Shipment::statuses[name]) }
  scope :from_today, ->{ where('shipments.start_date > ?', Time.zone.now.beginning_of_day) }

  validates_presence_of :user_id, message: "Your are not logged in."

  def as_json(options={})
    object = {}
    object[:id] = id if has_attribute?(:id)
    object[:start_date] = start_date.to_s if has_attribute?(:start_date)
    object[:end_date] = end_date.to_s if has_attribute?(:end_date)
    object[:po] = po if has_attribute?(:po)
    object[:company] = company if has_attribute?(:company)
    object[:status] = status if has_attribute?(:status)
    object[:user] = self.user.email if has_attribute?(:user_id)
    object
  end
end
