class Shipment < ActiveRecord::Base
  validates :po, presence: true
end
