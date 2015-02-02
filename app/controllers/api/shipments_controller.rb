class Api::ShipmentsController < ApplicationController
  respond_to :json
  before_action :set_shipment, only: [:show, :update, :destroy]
  before_action :authenticate_user!

  def index
    @shipment = Shipment.by_user(current_user)
    respond_with(@shipment)
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
    if @shipment.update_attriubutes(:shipment_params)
      respond_with(:api, @shipment)
    else
      render json: { errors: @shipment.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def destroy
    @shipment.destroy

    respond_with(@shipment)
  end

  private
  def shipment_params
    params.require(:shipment).permit(:po, :start_date, :end_date, :company, :status)
  end

  def set_shipment
    @shipment = Shipment.find_by(id: params[:id].to_i)
  end
end
