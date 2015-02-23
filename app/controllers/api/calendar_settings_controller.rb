class Api::CalendarSettingsController < ApplicationController
  respond_to :json
  before_action :authenticate_user!
  append_before_action :only_admin

  def create
    @calendar_setting = CalendarSetting.create(calendar_params)

    respond_with(:api, @calendar_setting)
  end

  def update
    @calendar_setting = CalendarSetting.first
    @calendar_setting.update_attributes(calendar_params)
    
    respond_with(:api, @calendar_setting)    
  end

  private
  def calendar_params
    params.require(:calendar_setting).permit(:slot_duration)
  end
  
  def only_admin
    unless current_user.admin?
      render json: { errors: "You don't have enough permissions." }, status: :forbidden
      return
    end
  end
end