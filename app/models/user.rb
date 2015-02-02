class User < ActiveRecord::Base
  # Include default devise modules.
  devise :database_authenticatable, :registerable,
          :recoverable, :rememberable, :trackable, :validatable,
          :async
  include DeviseTokenAuth::Concerns::User
  enum role: { carrier: 0, admin: 1 }

  validates_presence_of :first_name, :last_name, :phone_number
  has_many :shipments

  # def send_on_create_confirmation_instructions
  #   # do nothing
  # end

  def pending_reconfirmation?
    false
  end

  def skip_confirmation!
    # Need to override this
    # method in order to not 
    # produce an error during password reset
  end
end
