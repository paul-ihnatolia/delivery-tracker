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

  def as_json(options={})
    object = {}
    object[:id] = id if has_attribute? :id
    object[:role]= role if has_attribute? :role
    object[:name] = "#{last_name}, #{first_name}" if (has_attribute? :last_name) || (has_attribute? :first_name)
    object[:email] = email if has_attribute? :email
    object[:uid] = uid if has_attribute? :uis
    object[:phone_number] = phone_number if has_attribute? :phone_number
    object[:provider] = provider if has_attribute? :provider
    object[:created_at] = created_at.strftime("%m-%d-%Y") if has_attribute? :created_at
    object[:company] = company if has_attribute? :company
    object[:provider] = provider if has_attribute? :provider
    object[:uid] = uid if has_attribute? :uid
    object
  end
end
