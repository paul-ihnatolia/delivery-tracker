class Shipment < ActiveRecord::Base
  validates :po, presence: true
  enum status: { unresolved: 0, resolved: 1 }
end
