import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class TranslateService {
  url = 'https://translation.googleapis.com/language/translate/v2?key=';
  key = 'MIIEvwIBADANBgkqhkiG9w0BAQEFAASCBKkwggSlAgEAAoIBAQCRUHYE+I9epLmh\nbUgrp9acDb+Hziuqp7geHuOoiBmDuNJ8bUl9xs/LnTaOqL4Pl4mLXN/L4filig4S\nG1MS4rSZPcp15hlWmkCrtvFUiinEui+xveaXchQnlAuvBqQSCkYpgoBd/6CKRTvU\nH5OgUt5xS7M/B0g0MNFNp/iNDlteAkDVE0dK6UZ1hBfPuLXSmHPc0Sh4XY3sIaVO\neEVaX+rh0r2Z2rO1pveBdQqxkeuq2JNYs1psJLSFtDO8HKTMMTYj5Wtukgxsfb0v\nVNbme8a9UT1dzJuR4wkIGuD7PoykEQArck5ZQf8JlLVQq4nFW2Cuew/7lZXxEj3V\ngtGwgwT/AgMBAAECggEAD/d4UEmDb1HIN82LLYjOku0Ly39C2wh8uYqJVz5FF20a\na6OSfKh4spW+peQypgHvkgmNaZiVupK1wxWPhja0w1W/xj6XMCXYz0VVtQVNW5ld\nnjkQejmFr2eb9QpUwsqwNOVq92kcGbVLwp4JmYche+9mbZl+PIXUqaS4Mb+PGIAa\nfkltpABTG5bltf82pEMoMJ3BCG+UWS8dXsh8MtvIGiLFnws2qPV+AU2sv5sh6KQ9\n+Xu9p0WMRxTEQrmgbWsB0P4FvekjtVwaIfJbSwj8z8uJ6VzAfO9XbNB14orZ4/Bh\njP1eQM35dKD1JVDB9cgcvKCucu6U6d9vBRb7HWp4+QKBgQDC5c0Yk2kmxB+JdavV\nDT4K4Q7BHVN2OgIaUSktf0dNjY3tvL0xAIrGBy7n8gDvQuXQgenY47oe4PHdbZLl\ny+8jEuhOBuuDvESc1w6jrQ3gwp73iBlpzJnp5iROqV8n01vB5pOLrV3WmqcWR5/J\ng/2sD8Qj9ZsdBYG/LF7amU2j7QKBgQC+3ywpecATUwqRF8lhVzBfiPfrfZKmcJ9c\n/Zk3hOwSL96Tt/iDTkG8aq26d+aJulBO9Cl84BO3ANVqaTR9g+L33sLtjl6Otteh\nCUyFAytILYV0MkANIQw/BBrO7vruHoTFNLup0L/HyQjKODmZ+9OSraqeZQEOANjO\n/IrOTMxHGwKBgQCj9GXg8sFWl05geNkg1Y8H3+RlmKIJpyr1sKkPWS9Gknp/MHOH\nsYkMpiZTgUZAAOsLyP5MMubz6xAM0oztO+3kd5dtbGzb2Zlux4vNLVurZI4OdjPK\nyRABsFWCxwEBo9BhAfPFYQa77kX5fC9zetH/2ROLnKXseCF6DX2OL8Ec0QKBgQC1\njg6xvO9o8jpA3QFep9KJbP11cFKIIuRTTZ3p43OxsPrkQ8ANFekNUePCVL5jD2fI\nUhMMhw/5qL9Xoo6dPVAtOiTsVdm3ok/lC7VPaD5JP5OLfSjT1DWT01G0uDjTOxBL\njOdclgV2AdFsmKKhx5nuEWcTlzuzmDaiXDGkHgTJNQKBgQC3hV18+fub2cZwf/FO\nb+QfS/TAoVnPbyO5a1XbCdmca/SDDDbY6NS1PcOviCtEAO/3WF1Yc408T9avWkh4\nbs48fzjdwLWUWvr3GWUshywWfmwGHVCaXutUNN9fg9/gEvQ/DeyCKMHLOvFANHDV\niRcB4G0S9e+eAMn52LTGpqFEPA==';

  constructor(private http: HttpClient) { }

  translate(obj: GoogleObj) {
    return this.http.post(this.url + this.key, obj);
    }
}

export interface GoogleObj {
  q: string[];
  target: string;
}
