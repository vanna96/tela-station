. Ordering
    . S/O - Control
        . Lock Sales Order                                                                              |
            function: able to turn on/off to validate if THE USER can add new sales order or not.       |  
            UI: can be switch/ or checkbox button name : Lock Sales Order                               |

        . Lock Sales Order Exemption
            permission to user can allow to do base on condition s/o                                    |
                . Customer                                                                              |  
                . Line of bussiness                                                                     |
                . Price List                                                                            |

        . Sales Order – Credit Limit Check
            open a/r + open/ delviery + open/sale compa re                                              |   
            

    . S/O - Logistic
        . Ship-To : select warehouse from BP                                                            |
        . Ship-From : select from branch                                                                |
        . attn-Termianl: when Ship-From not available for shiping                                       |
    . S/O - Order                                                                                       |
        . Sales order 
        . Pump Sales : what is this for?
        . View and Print : what's thoses kind of print (pdf, excel, custom view)?
            • Delivery Document
            • A/R Invoice Document
            • A/R Aging Report
            • Customer Master Data

. Collection
    . Settle Receipt        |
    . Payment on Account    |   => Incomimg Payment
    . Direct to Account     |

. Expense Log 
    . Expense Code = Expense Dictionary => Expense type in sap (debit)
    . Cash Account => outgoing payment (credit) filter by station, branch
    . Expense Log   => (concept like p/o) sap object from say eang
    . Expense Clearence => copy from Expense log where status eq `Close` and change status expense log to `Clear`

. Stock Control 
    . Inventory Transfer Reqquest(creat good Receipt, good issue)        |
    . Inventory Transfer                                            |   => Inventory Transfer 
    . Goods Receipt                                                 |
    . Goods Issue                                                   |

    . Goods Usage
        => This function will allow users at the station to perform goods issue from its warehouses direct to expense
        code, which are predefined in expense code data
    . Pump Test
    . Fuel Level



=> All features  on sap to apply on

what is line of bussiness in sale order?

sale order:
    10. check condition on document can be used in multple line of bussiness or single line of bussiness 

    