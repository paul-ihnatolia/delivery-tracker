class Overrides::DeviseTokenAuth::PasswordsController < DeviseTokenAuth::PasswordsController
  def update
    puts "100" * 100
    # make sure user is authorized
    unless @resource
      return render json: {
        success: false,
        errors: ['Unauthorized']
      }, status: 401
    end

    # make sure account doesn't use oauth2 provider
    unless @resource.provider == 'email'
      return render json: {
        success: false,
        errors: ["This account does not require a password. Sign in using "+
                 "your #{@resource.provider.humanize} account instead."]
      }, status: 422
    end

    # ensure that password params were sent
    unless password_resource_params[:password] and password_resource_params[:password_confirmation]
      return render json: {
        success: false,
        errors: ['You must fill out the fields labeled "password" and "password confirmation".']
      }, status: 422
    end

    # Clear all tokens
    if @resource.update_attributes(password_resource_params) && @resource.update_attribute('tokens', {})
      return render json: {
        success: true,
        data: {
          message: "Your password has been successfully updated."
        }
      }
    else
      return render json: {
        success: false,
        errors: @resource.errors
      }, status: 422
    end
  end
end