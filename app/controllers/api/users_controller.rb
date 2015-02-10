class Api::UsersController < ApplicationController
  respond_to :json
  before_action :authenticate_user!
  before_action :only_admin

  def index
    @user_emails = User.where(role: 0).map(&:email)
    respond_with(@user_emails)
  end

  private
  def only_admin
    unless current_user.admin?
      render json: { errors: "You don't have permissions" }, status: 403
      return 
    end
  end
end