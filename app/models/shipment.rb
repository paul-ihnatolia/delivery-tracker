class Shipment < ActiveRecord::Base
  validates :po, presence: true
  enum category: { shipping: 0, receiving: 1 }
  belongs_to :user

  def self.by_user user
    # For carrier
    where(user_id: user.id)
  end

  def self.not_by_user user
    where.not(user_id: user.id)
  end

  def self.by_date_range date_range
    start_date = DateTime.parse(date_range.split('-').first).beginning_of_day
    end_date = DateTime.parse(date_range.split('-').last).end_of_day
    where(start_date: start_date..end_date)
  end

  scope :by_email, ->(email) { joins(:user).where('users.email = ?', email) }
  scope :not_by_email, ->(email) { joins(:user).where('users.email != ?', email) }
  scope :by_category, ->(name) { where('shipments.category = ?', Shipment::categories[name]) }
  scope :from_today, ->{ where('shipments.start_date > ?', Time.zone.now.beginning_of_day) }

  validates_presence_of :user_id, message: "Your are not logged in."

  def as_json(options={})
    object = {}
    object[:id] = id if has_attribute?(:id)
    object[:start_date] = start_date.strftime("%m-%d-%Y %I:%M%p") if has_attribute?(:start_date)
    object[:end_date] = end_date.strftime("%m-%d-%Y %I:%M%p") if has_attribute?(:end_date)
    object[:po] = po if has_attribute?(:po)
    object[:company] = company if has_attribute?(:company)
    object[:category] = category if has_attribute?(:category)
    object[:user] = self.user.email if has_attribute?(:user_id)
    object
  end
end
