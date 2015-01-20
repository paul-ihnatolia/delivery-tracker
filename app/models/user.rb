class User < ActiveRecord::Base
  # Include default devise modules.
  devise :database_authenticatable, :registerable,
          :recoverable, :rememberable, :trackable, :validatable#,
          #:confirmable
  include DeviseTokenAuth::Concerns::User

  validates_presence_of :first_name, :last_name, :phone_number

  def send_on_create_confirmation_instructions
    # do nothing
  end
end
