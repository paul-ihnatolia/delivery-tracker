class Api::ShipmentsController < ApplicationController
  respond_to :json
  before_action :set_shipment, only: [:show, :update, :destroy]
  before_action :authenticate_user!

  def index
    if current_user.admin?
      @shipments = Shipment.all
      
      if params[:category].present?
        @shipments = @shipments.by_category(params[:category])
      end

      if params[:date_range].present?
        @shipments = @shipments.by_date_range(params[:date_range])
      end
      
      if params[:email].present?
        @shipments = @shipments.by_email(params[:email]) +
          Shipment.from_today.by_category(params[:category]).not_by_email(params[:email])
      end
    else
      if params[:date].present?
        # return shipments by date
        @shipments = Shipment.by_date(params[:date])
      else
        @shipments = Shipment.by_user(current_user) + 
          Shipment.from_today.not_by_user(current_user).select(:start_date, :end_date, :category);
      end
    end
    respond_with(@shipments)
  end

  def show
    @shipment = Shipment.find_by(:id => params[:id].to_i)
  end

  def create
    shipment_params = shipment_params()
    shipment_params[:user] = if current_user.admin?
      User.find_by(email: shipment_params[:user])
    else
      current_user
    end

    @shipment = Shipment.new(shipment_params)

    if @shipment.save
      render json: { shipment: @shipment }
    else
      render json: { errors: @shipment.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def update
    # If user tries to update foreign shipment
    if !current_user.admin? && @shipment.user != current_user
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
    if !current_user.admin? && @shipment.user != current_user
      render json: { errors: "You don't have permissions" }, status: 403
      return
    end

    @shipment.destroy
    # TODO notify user
    respond_with(@shipment)
  end

  private
  def shipment_params
    if current_user.admin?
      params.require(:shipment).permit(:po, :start_date, :end_date, :company, :category, :user)
    else
      params.require(:shipment).permit(:po, :start_date, :end_date, :company, :category)
    end
  end

  def shipment_update_params
    if current_user.admin?
      params.require(:shipment).permit(:po, :start_date, :end_date, :company, :status)
    else
      # Carrier can only update a shiping category
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
