class Api::ShipmentsController < ApplicationController
  respond_to :json
  before_action :set_shipment, only: [:show, :update, :destroy]

  def index
    @shipment = Shipment.all
    respond_with(@shipment)
  end

  def show
    @shipment = Shipment.find_by(:id => params[:id].to_i)
  end

  def create
    @shipment = Shipment.new(shipment_params)

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
    params.require(:shipment).permit(:po, :start, :end, :company, :status)
  end

  def set_shipment
    @shipment = Shipment.find_by(id: params[:id].to_i)
  end
end
