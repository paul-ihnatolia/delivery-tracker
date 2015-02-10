class Api::ShipmentsController < ApplicationController
  respond_to :json
  before_action :set_shipment, only: [:show, :update, :destroy]
  before_action :authenticate_user!

  def index
    if current_user.admin?
      if params[:email].present?
        @shipments = Shipment.joins(:user).where('users.email = ?', params[:email])
      else
        @shipments = Shipment.all
      end
    else
      @shipments = Shipment.by_user(current_user)
    end
    respond_with(@shipments)
  end

  def show
    @shipment = Shipment.find_by(:id => params[:id].to_i)
  end

  def create
    @shipment = Shipment.new(shipment_params)
    @shipment.user = current_user

    if @shipment.save
      render json: { shipment: @shipment }
    else
      render json: { errors: @shipment.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def update
    # If user tries to update foreign shipment
    if @shipment.user != current_user
      render json: { errors: "You don't have permissions" }, status: 403
      return
    end

    if @shipment.update_attributes(shipment_update_params)
      respond_with(:api, @shipment)
    else
      render json: { errors: @shipment.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def destroy
    if @shipment.user != current_user
      render json: { errors: "You don't have permissions" }, status: 403
      return
    end

    @shipment.destroy
    # TODO notify user
    respond_with(@shipment)
  end

  private
  def shipment_params
    params.require(:shipment).permit(:po, :start_date, :end_date, :company, :status)
  end

  def shipment_update_params
    if current_user.admin?
      params.require(:shipment).permit(:po, :start_date, :end_date, :company)
    else
      # Carrier can only update a shiping status
      params.require(:shipment).permit(:po, :company)
    end
  end

  def set_shipment
    @shipment = Shipment.find_by(id: params[:id].to_i)
    if @shipment.nil?
      render json: { errors: ['Shipment not found.'] }, status: :not_found
    end
  end
end
