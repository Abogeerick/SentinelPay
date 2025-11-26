using AutoMapper;
using FalconPay.FraudShield.Domain.Entities;
using FalconPay.FraudShield.Shared.DTOs.Auth;
using FalconPay.FraudShield.Shared.DTOs.Wallet;
using FalconPay.FraudShield.Shared.DTOs.Fraud;

namespace FalconPay.FraudShield.Application.Mappings;

public class MappingProfile : Profile
{
    public MappingProfile()
    {
        CreateMap<User, UserDto>()
            .ForMember(dest => dest.Id, opt => opt.MapFrom(src => src.Id.ToString()))
            .ForMember(dest => dest.Name, opt => opt.MapFrom(src => src.Name ?? src.Email))
            .ForMember(dest => dest.Avatar, opt => opt.MapFrom(src => src.Avatar ?? ""));

        CreateMap<Wallet, WalletDto>();
        
        CreateMap<Transaction, TransactionDto>()
            .ForMember(dest => dest.Id, opt => opt.MapFrom(src => src.Id.ToString()))
            .ForMember(dest => dest.Date, opt => opt.MapFrom(src => src.CreatedAt.ToString("o")));

        CreateMap<FraudEvent, FraudAlertDto>()
            .ForMember(dest => dest.Id, opt => opt.MapFrom(src => src.Id.ToString()))
            .ForMember(dest => dest.Timestamp, opt => opt.MapFrom(src => src.CreatedAt.ToString("o")));
    }
}
