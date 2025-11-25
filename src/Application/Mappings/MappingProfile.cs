using AutoMapper;
using FalconPay.FraudShield.Domain.Entities;
using FalconPay.FraudShield.Shared.DTOs.Auth;

namespace FalconPay.FraudShield.Application.Mappings;

public class MappingProfile : Profile
{
    public MappingProfile()
    {
        CreateMap<User, UserDto>();
    }
}

