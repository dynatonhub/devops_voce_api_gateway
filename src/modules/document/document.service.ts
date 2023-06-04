import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';

@Injectable()
export class DocumentService {
  constructor(private readonly httpService: HttpService) {}
  private formatCNPJ = (cnpj: string) => {
    const regex = /[^\d]/g;
    return cnpj.replace(regex, '');
  };
  private checkValidCNPJ = (cnpj: string): boolean => {
    cnpj = this.formatCNPJ(cnpj);
    const blackList = [
      '00000000000000',
      '11111111111111',
      '22222222222222',
      '33333333333333',
      '44444444444444',
      '55555555555555',
      '66666666666666',
      '77777777777777',
      '88888888888888',
      '99999999999999',
    ];
    if (cnpj.length !== 14 || blackList.includes(cnpj)) return false;
    let size = cnpj.length - 2;
    let numbers = cnpj.substring(0, size);
    const digits = cnpj.substring(size);
    let sum = 0;
    let pos = size - 7;
    for (let i = size; i >= 1; i--) {
      sum += Number(numbers.charAt(size - i)) * pos--;
      if (pos < 2) pos = 9;
    }
    let result = sum % 11 < 2 ? 0 : 11 - (sum % 11);
    if (result !== Number(digits.charAt(0))) return false;
    size += 1;
    numbers = cnpj.substring(0, size);
    sum = 0;
    pos = size - 7;
    for (let i = size; i >= 1; i--) {
      sum += Number(numbers.charAt(size - i)) * pos--;
      if (pos < 2) pos = 9;
    }
    result = sum % 11 < 2 ? 0 : 11 - (sum % 11);
    if (result !== Number(digits.charAt(1))) return false;
    return true;
  };
  async checkCNPJ(cnpj: string): Promise<any> {
    try {
      if (!this.checkValidCNPJ(cnpj)) return { message: 'CNPJ inválido' };
      const { data, status } = await this.httpService
        .get(`https://brasilapi.com.br/api/cnpj/v1/${this.formatCNPJ(cnpj)}`)
        .toPromise();
      if (status === 200) return data;
      else return { message: 'CNPJ inválido' };
    } catch (error) {
      return error;
    }
  }
}
